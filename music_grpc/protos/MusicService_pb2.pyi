from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class AddMusicRequest(_message.Message):
    __slots__ = ["chunk_data", "metadata"]
    CHUNK_DATA_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    chunk_data: bytes
    metadata: MetaData
    def __init__(self, metadata: _Optional[_Union[MetaData, _Mapping]] = ..., chunk_data: _Optional[bytes] = ...) -> None: ...

class AddMusicResponse(_message.Message):
    __slots__ = ["status", "url"]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    URL_FIELD_NUMBER: _ClassVar[int]
    status: bool
    url: str
    def __init__(self, status: bool = ..., url: _Optional[str] = ...) -> None: ...

class MetaData(_message.Message):
    __slots__ = ["extension", "filename"]
    EXTENSION_FIELD_NUMBER: _ClassVar[int]
    FILENAME_FIELD_NUMBER: _ClassVar[int]
    extension: str
    filename: str
    def __init__(self, filename: _Optional[str] = ..., extension: _Optional[str] = ...) -> None: ...

class MusicRequest(_message.Message):
    __slots__ = ["uuid"]
    UUID_FIELD_NUMBER: _ClassVar[int]
    uuid: str
    def __init__(self, uuid: _Optional[str] = ...) -> None: ...

class MusicResponse(_message.Message):
    __slots__ = ["url"]
    URL_FIELD_NUMBER: _ClassVar[int]
    url: str
    def __init__(self, url: _Optional[str] = ...) -> None: ...

class RemoveMusicRequest(_message.Message):
    __slots__ = ["uuid"]
    UUID_FIELD_NUMBER: _ClassVar[int]
    uuid: str
    def __init__(self, uuid: _Optional[str] = ...) -> None: ...

class RemoveMusicResponse(_message.Message):
    __slots__ = ["status"]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    status: bool
    def __init__(self, status: bool = ...) -> None: ...
