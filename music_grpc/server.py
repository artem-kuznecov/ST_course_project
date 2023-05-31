import io

import protos.MusicService_pb2 as MusicService_pb2
import protos.MusicService_pb2_grpc as MusicService_pb2_grpc
from minio_python.minio import MinioClass
import grpc
import logging

from concurrent import futures


def get_filepath(filename, extension):
    return f'{filename}{extension}'


class Music(MusicService_pb2_grpc.MusicServicer):
    def requestMusic(self, request, context):
        url = f'http://127.0.0.1:9000{minio.get_music("test", request.uuid)}'
        return MusicService_pb2.MusicResponse(url=url)

    def addMusic(self, request_iterator, context):

        data = bytearray()
        filepath = 'dummy'

        for request in request_iterator:
            if request.metadata.filename and request.metadata.extension:
                filepath = get_filepath(request.metadata.filename, request.metadata.extension)
                continue
            data.extend(request.chunk_data)

        url = minio.add_music("test", filepath, data)
        data.clear()

        return MusicService_pb2.AddMusicResponse(url=url, status=True)

    def removeMusic(self, request, context):
        minio.remove_music("test", request.uuid)
        return MusicService_pb2.RemoveMusicResponse(status=True)


        # data_stream = request.music
        # data = io.BytesIO(data_stream)
        # print(data)
        # minio.add_music("test", request.uuid, data)
        # url = f'http://127.0.0.1:9000{minio.get_music("test", request.uuid)}'
        # return MusicService_pb2.AddMusicResponse(status=True, url=url)


def serve():
    port = '50051'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    MusicService_pb2_grpc.add_MusicServicer_to_server(Music(), server)
    server.add_insecure_port('[::]:' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == "__main__":
    logging.basicConfig()
    minio = MinioClass()
    serve()
