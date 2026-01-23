from __future__ import annotations
from threading import Lock
from typing import Dict

from rembg import new_session

class RembgSessionManager:
    """
    Cache session theo tên model.
    Tạo session lần đầu, các lần sau reuse (nhanh hơn rất nhiều).
    """
    def __init__(self) -> None:
        self._lock = Lock()
        self._sessions: Dict[str, object] = {}

    def get(self, model_name: str):
        model_name = (model_name or "").strip()
        if not model_name:
            model_name = "u2net"

        with self._lock:
            s = self._sessions.get(model_name)
            if s is None:
                s = new_session(model_name)
                self._sessions[model_name] = s
            return s

# singleton dùng chung toàn app
session_manager = RembgSessionManager()
