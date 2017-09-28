package com.swellsys.ncs.service;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swellsys.ncs.mapper.BoardMapper;
import com.swellsys.ncs.mapper.CategoryMapper;
import com.swellsys.ncs.mapper.LikeMapper;

@Service("likeService")
public class LikeService {

	@Autowired
	LikeMapper mapper;

	/**
	 * 좋아요 처리
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int likeProc(HashMap<String, Object> params) throws Exception {
		int result = 0;
		if(FormatUtil.toString(params.get("like_flag")).equals("Y")){
			result += this.insertLike(params);	
		}else{
			result += this.deleteLike(params);
		}
		return result;
	}
	
	/**
	 * 좋아요 등록
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int insertLike(HashMap<String, Object> params) throws Exception {
		return mapper.insertLike(params);
	}
	
	/**
	 * 좋아요 삭제
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int deleteLike(HashMap<String, Object> params) throws Exception {
		return mapper.deleteLike(params);
	}
	
	/**
	 * 좋아요 카운트
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectLikeCount(HashMap<String, Object> params) throws Exception {
		return mapper.selectLikeCount(params);
	}
	
	/**
	 * 좋아요 여부
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public String selectLikeSelf(HashMap<String, Object> params) throws Exception {
		return mapper.selectLikeSelf(params);
	}
}
