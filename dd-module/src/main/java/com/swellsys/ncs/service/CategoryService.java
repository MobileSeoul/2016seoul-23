package com.swellsys.ncs.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swellsys.ncs.mapper.CategoryMapper;

@Service("categoryService")
public class CategoryService {

	@Autowired
	CategoryMapper mapper;

	/**
	 * 카테고리 카운트 확인
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectCategoryCount(HashMap<String, Object> params) throws Exception {
		return mapper.selectCategoryCount(params);
	}
	
	/**
	 * 카테고리 정보 등록
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int insertCategory(HashMap<String, Object> params) throws Exception {
		return mapper.insertCategory(params);
	}
	
	/**
	 * 카테고리 정보 삭제
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int deleteCategory(HashMap<String, Object> params) throws Exception {
		return mapper.deleteCategory(params);
	}
	
	
	/**
	 * 카테고리 조회
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public  List<HashMap<String, Object>> selectCategory(HashMap<String, Object> params) throws Exception {
		return mapper.selectCategory(params);
	}	
}
