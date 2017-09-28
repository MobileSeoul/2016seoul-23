package com.swellsys.ncs.mapper;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.annotation.Mapper;


@Mapper
public interface BoardMapper {
	
	//글쓰기
	public int insertBoard(HashMap<String, Object> params) throws Exception;

	//글수정
	public int updateBoard(HashMap<String, Object> params) throws Exception;
	
	//글삭제
	public int deleteBoard(HashMap<String, Object> params) throws Exception;	
	

	//글 리스트 카운트
	public int selectBoardCount(HashMap<String, Object> params) throws Exception;
	
	//글 리스트
	public List<HashMap<String, Object>> selectBoardList(HashMap<String, Object> params) throws Exception;	
	
	//글 상세
	public HashMap<String, Object> selectBoardDetail(HashMap<String, Object> params) throws Exception;

	//글 수정 화면용
	public HashMap<String, Object> selectBoardDetailModify(HashMap<String, Object> params) throws Exception;
}
