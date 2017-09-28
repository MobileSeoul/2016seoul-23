package com.swellsys.ncs.mapper;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.annotation.Mapper;


@Mapper
public interface CategoryMapper {
	
	//카테고리 카운트 확인
	public int selectCategoryCount(HashMap<String, Object> params) throws Exception;

	//카테고리 정보 등록
	public int insertCategory(HashMap<String, Object> params) throws Exception;
	
	//카테고리 정보 삭제
	public int deleteCategory(HashMap<String, Object> params) throws Exception;
	
	
	//카테고리 정보 조회
	public List<HashMap<String, Object>> selectCategory(HashMap<String, Object> params) throws Exception;
	
	
}
