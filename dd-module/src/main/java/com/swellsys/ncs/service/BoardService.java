package com.swellsys.ncs.service;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swellsys.ncs.mapper.BoardMapper;
import com.swellsys.ncs.mapper.CategoryMapper;

@Service("boardService")
public class BoardService {

	@Autowired
	BoardMapper mapper;

	/**
	 * 글쓰기 처리
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int writeProc(HashMap<String, Object> params) throws Exception {
		int result = 0;
		
		result += this.insertBoard(params);
		
		return result;
	}
	
	
	/**
	 * 글수정 처리
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int modifyProc(HashMap<String, Object> params) throws Exception {
		int result = 0;
		
		result += this.updateBoard(params);
		
		return result;
	}
	
	/**
	 * 글삭제 처리
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int deleteProc(HashMap<String, Object> params) throws Exception {
		int result = 0;
		
		result += this.deleteBoard(params);
		
		return result;
	}
	
	/**
	 * 글쓰기
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int insertBoard(HashMap<String, Object> params) throws Exception {
		return mapper.insertBoard(params);
	}
	
	/**
	 * 글수정
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int updateBoard(HashMap<String, Object> params) throws Exception {
		return mapper.updateBoard(params);
	}
	
	/**
	 * 글삭제
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int deleteBoard(HashMap<String, Object> params) throws Exception {
		return mapper.deleteBoard(params);
	}
	
	
	/**
	 * 글 리스트 정보
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> selectBoard(HashMap<String, Object> params) throws Exception {
		HashMap<String, Object> reMap = new HashMap<String, Object>();
		
		int totalCount = selectBoardCount(params);		
		params.put("totalCount",totalCount);
		params = PageUtil.pageParam(params);

		
		reMap.put("page", PageUtil.pageMap(params,"mm_type"));
		List<HashMap<String, Object>> list = this.selectBoardList(params);
		reMap.put("list", list);		
		
		return reMap;
		
	}
	
	
	
	/**
	 * 글 리스트 카운트
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectBoardCount(HashMap<String, Object> params) throws Exception {
		return mapper.selectBoardCount(params);
	}
	
	
	/**
	 * 글 리스트
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public List<HashMap<String, Object>> selectBoardList(HashMap<String, Object> params) throws Exception {
		return mapper.selectBoardList(params);
	}
	
	
	/**
	 * 글 상세
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> selectBoardDetail(HashMap<String, Object> params) throws Exception {
		return mapper.selectBoardDetail(params);
	}
	
	
	/**
	 * 글 수정 화면용
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> selectBoardDetailModify(HashMap<String, Object> params) throws Exception {
		return mapper.selectBoardDetailModify(params);
	}
}
