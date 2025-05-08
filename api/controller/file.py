# !/usr/bin/python3
# -*- coding: utf-8 -*-
"""
@File  : files.py
@Author: White Gui
@Date  : 2025/5/7
@Desc :
"""
from typing import Optional, Annotated

from fastapi import APIRouter, HTTPException, UploadFile, Depends, Query, Form

from common import utils
from common.const import CONST
from common.logger import log
from dao.aliyun import oss_service
from models import User
from models.view.material import MaterialVO
from services import material_service, file_service
from services.auth_service import get_current_user

router = APIRouter()


@router.get("/materials")
async def get_file_view(params: Annotated[MaterialVO, Query()],
                        current_user: Annotated[User, Depends(get_current_user)]):
    """
        获取需要的参数
    :return:
    """
    user_id = current_user.id
    materials = await material_service.get_material_list(user_id, params)
    data = {
        CONST.MATERIALS: materials,
    }
    return utils.resp_success(data=data)


@router.get("/files")
async def get_uploaded_files_endpoint(conversation_id: Optional[str] = None):
    """
        查询已经上传好的文件列表
    :param conversation_id:
    :return:
    """
    files_dict = await file_service.get_uploaded_files(conversation_id)
    log.debug(f"SUCCESS to get uploaded file list: {files_dict}, conversation_id: {conversation_id}")
    return utils.resp_success(data={
        CONST.FILES: files_dict
    })


@router.post("/files")
async def upload_files(
        files: list[UploadFile] = Form(...),
        product_id: str = Form(...),
        conversation_id: str = Form(...),
        file_type: str = Form(...),
        current_user: Annotated[User, Depends(get_current_user)] = None
):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    log.info(f"Try to handle files, files size: {len(files)}")
    user_id = current_user.id
    for uploaded_file in files:
        file_name = uploaded_file.filename
        # Save the file
        bucket = oss_service.get_bucket()
        content = await uploaded_file.read()
        bucket_key = f"users/{user_id}/{file_name}"
        oss_service.upload_file(bucket, bucket_key, data=content)
        # Store file info in database
        await file_service.store_file(conversation_id, file_name, file_type, bucket_key)

    return utils.resp_success()
