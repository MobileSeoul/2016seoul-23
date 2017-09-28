package com.swellsys.ncs.mapper;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.annotation.Mapper;


@Mapper
public interface LikeMapper {
	
	//좋아요 등록
	public int insertLike(HashMap<String, Object> params) throws Exception;

	//좋아요 삭제
	public int deleteLike(HashMap<String, Object> params) throws Exception;
	
	//좋아요 카운트
	public int selectLikeCount(HashMap<String, Object> params) throws Exception;	
	
	//좋아요 여부
	public String selectLikeSelf(HashMap<String, Object> params) throws Exception;
	
}
