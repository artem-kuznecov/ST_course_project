from minio import Minio
from minio.error import S3Error
from config import Config
import io


class MinioClass:
    def __init__(self):
        try:
            self.config = Config('/home/vadim/bmstu/music_grpc/minio_python/minio_config.cfg')
            self.client = Minio(endpoint=self.config['socket'],
                                access_key=self.config['access_key'],
                                secret_key=self.config['secret_key'],
                                secure=False)
        except S3Error as e:
            print("minio error occurred: ", e)
        except Exception as e:
            print("unexpected error: ", e)

    def __del__(self):
        print('minio connection closed')

    def add_user(self, username: str):
        try:
            print(username)
            self.client.make_bucket(username)
        except S3Error as e:
            print("minio error occurred: ", e)
        except Exception as e:
            print("unexpected error: ", e)

    def add_music(self, username: str, title: str, content):
        try:
            data = io.BytesIO(content)
            result = self.client.put_object(bucket_name=username,
                                            object_name=title,
                                            data=data,
                                            length=len(content))

            # result = self.client.fput_object(
            #     username, title, content,
            # )
            return result.location
        except S3Error as e:
            print("minio error occurred: ", e)
        except Exception as e:
            print("unexpected error: ", e)

    def get_music_list(self, username: str):
        list_of_music = []
        try:
            music_list = self.client.list_objects(bucket_name=username)
            for note in music_list:
                list_of_music.append(note.object_name)
                return list_of_music
            return
        except S3Error as e:
            print("minio error occurred: ", e)
        except Exception as e:
            print("unexpected error: ", e)

    def get_music(self, username: str, title: str):
        try:
            result = self.client.get_object(bucket_name=username,
                                            object_name=title)
            return result.url
        except S3Error as e:
            print("minio error occurred: ", e)
        except Exception as e:
            print("unexpected error: ", e)

    def remove_music(self, username: str, title: str):
        try:
            result = self.client.remove_object(bucket_name=username, object_name=title)
        except S3Error as e:
            print("minio error occurred: ", e)
        except Exception as e:
            print("unexpected error: ", e)
