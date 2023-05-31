import os

import protos.MusicService_pb2 as MusicService_pb2
import protos.MusicService_pb2_grpc as MusicService_pb2_grpc
import grpc
import logging


def get_filepath(filename, extension):
    return f'{filename}{extension}'


def read_iterfile(filepath, chunk_size=1024):
    split_data = os.path.splitext(filepath)
    filename = split_data[0]
    extension = split_data[1]

    metadata = MusicService_pb2.MetaData(filename=filename, extension=extension)
    yield MusicService_pb2.AddMusicRequest(metadata=metadata)
    with open(filepath, mode="rb") as f:
        while True:
            chunk = f.read(chunk_size)
            if chunk:
                entry_request = MusicService_pb2.AddMusicRequest(chunk_data=chunk)
                yield entry_request
            else:  # The chunk was empty, which means we're at the end of the file
                return


def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = MusicService_pb2_grpc.MusicStub(channel)
        response = stub.requestMusic(MusicService_pb2.MusicRequest(uuid="THkcAqmTRcQ.jpg"))

        response2 = stub.addMusic(read_iterfile('/home/vadim/Загрузки/INSTASAMKA_-_Tyagi_75868475.mp3'))

        response3 = stub.removeMusic(MusicService_pb2.RemoveMusicRequest(uuid=''))

    print(response.url)
    print(response2.url, response2.status)
    print(response3.status)


if __name__ == "__main__":
    logging.basicConfig()
    run()
