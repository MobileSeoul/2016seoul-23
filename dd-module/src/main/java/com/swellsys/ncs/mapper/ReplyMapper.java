package com.swellsys.ncs.mapper;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.annotation.Mapper;


@Mapper
public interface ReplyMapper {
	
	//글쓰기
	public int insertReply(HashMap<String, Object> params) throws Exception;

	//글 리스트 카운트
	public int selectReplyCount(HashMap<String, Object> params) throws Exception;
	
	//글 리스트
	public List<HashMap<String, Object>> selectReplyList(HashMap<String, Object> params) throws Exception;	
	
	//댓글 삭제
	public int deleteReply(HashMap<String, Object> params) throws Exception;	
	
}
