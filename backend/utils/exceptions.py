"""
Custom API exceptions.
"""

from fastapi import HTTPException


class AdditException(HTTPException):

    def __init__(
        self,
        message: str,
        status_code: int = 400
    ):

        super().__init__(
            status_code=status_code,
            detail={
                "success": False,
                "message": message
            }
        )