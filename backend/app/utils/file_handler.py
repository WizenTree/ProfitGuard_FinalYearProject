# import os
# from uuid import uuid4

# UPLOAD_DIR = "backend/data/uploads"

# def save_file(file):
#     os.makedirs(UPLOAD_DIR, exist_ok=True)  # ensure folder exists

#     ext = file.filename.split(".")[-1]
#     filename = f"{uuid4()}.{ext}"
#     filepath = os.path.join(UPLOAD_DIR, filename)

#     with open(filepath, "wb") as f:
#         f.write(file.file.read())

#     return filepath   

import os
from uuid import uuid4

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
UPLOAD_DIR = os.path.join(BASE_DIR, "data", "uploads")

def save_file(file):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    ext = file.filename.split(".")[-1]
    filename = f"{uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(file.file.read())

    return filepath