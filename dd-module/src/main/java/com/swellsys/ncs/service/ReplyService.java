package com.swellsys.ncs.service;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swellsys.ncs.mapper.BoardMapper;
import com.swellsys.ncs.mapper.CategoryMapper;
import com.swellsys.ncs.mapper.ReplyMapper;

@Service("replyService")
public class ReplyService {

	@Autowired
	ReplyMapper mapper;

	/**
	 * 글저장
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int writeProc(HashMap<String, Object> params) throws Exception {
		int result = 0;
		
		result += this.insertReply(params);
		return result;
	}
	
	/**
	 * 글쓰기
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int insertReply(HashMap<String, Object> params) throws Exception {
		return mapper.insertReply(params);
	}
	
	
	/**
	 * 글 리스트 정보
	 * @param params
	 * @return
	 * @throws Exception
	 */
	/*public HashMap<String, Object> selectBoard(HashMap<String, Object> params) throws Exception {
		HashMap<String, Object> reMap = new HashMap<String, Object>();
		
		int totalCount = selectBoardCount(params);		
		params.put("totalCount",totalCount);
		params = PageUtil.pageParam(params);

		
		reMap.put("page", PageUtil.pageMap(params,"mm_type"));
		List<HashMap<String, Object>> list = this.selectBoardList(params);
		reMap.put("list", list);		
		
		return reMap;
		
	}*/
	
	
	
	/**
	 * 글 리스트 카운트
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectReplyCount(HashMap<String, Object> params) throws Exception {
		return mapper.selectReplyCount(params);
	}
	
	
	/**
	 * 글 리스트
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public List<HashMap<String, Object>> selectReplyList(HashMap<String, Object> params) throws Exception {
		return mapper.selectReplyList(params);
	}
	
	
	
	
	
	/**
	 * 댓글 삭제 처리
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int replyDeleteProc(HashMap<String, Object> params) throws Exception {
		return this.deleteReply(params);
	}

	/**
	 * 댓글 삭제
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int deleteReply(HashMap<String, Object> params) throws Exception {
		return mapper.deleteReply(params);
	}
}
