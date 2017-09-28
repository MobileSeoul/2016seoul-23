package com.swellsys.ncs.web.controller;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.playthm.core.model.HTMLMessage;
import org.playthm.core.model.HTMLMessage.TARGET;
import org.playthm.core.model.PageAuth;
import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.PageUtil;
import org.playthm.module.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.swellsys.ncs.service.BoardService;
import com.swellsys.ncs.service.CategoryService;
import com.swellsys.ncs.service.LikeService;
import com.swellsys.ncs.service.MemberService;
import com.swellsys.ncs.service.ReplyService;


@Controller
public class BoardController extends BaseController {
	{
		pageAuth.put("USER", PageAuth.AUTH);
	}
	
	@Autowired
	private BoardService boardService;
	@Autowired
	private ReplyService replyService;
	@Autowired
	private LikeService likeService;
	@Autowired
	private CategoryService categoryService;
	
	
	
	/**
	 * 게시글 리스트 정보
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	/*@RequestMapping(value = {"/board/boardList.do"}, method = RequestMethod.POST)*/
	@RequestMapping(value = {"/board/boardList.do"})
	public @ResponseBody HashMap<String, Object> boardList(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		
		result.put("data",boardService.selectBoard(params));
		
		return result;
	}
	
	/**
	 * 글쓰기
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/board/write.do"})
	public String write(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		model.addAttribute("categoryList", categoryService.selectCategory(params));
		return "/board/write";
	}
	
	
	/**
	 * 글쓰기
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/board/modify.do"})
	public String modify(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> board = boardService.selectBoardDetailModify(params);
		if(board == null){
			model.addAttribute("HTMLMessage", new HTMLMessage("잘못된 요청입니다.", "", HTMLMessage.TARGET.BACK));
			return "message/message";
		}else{
			model.addAttribute("categoryList", categoryService.selectCategory(params));
			model.addAttribute("board", board);
			model.addAttribute("ModifyMode", "Y");
			return "/board/modify";			
		}
	}
	
	/**
	 * 글 저장
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/writeProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> writeProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		
		if(chk){
			int reCnt = boardService.writeProc(params);
			result.put("data", true);
		}
		return result;
	}
	
	/**
	 * 글 수정 처리
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/modifyProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> modifyProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		
		if(chk){
			int reCnt = boardService.modifyProc(params);
			result.put("data", true);
		}
		return result;
	}
	
	/**
	 * 글 삭제 처리
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/deleteProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> deleteProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		
		if(chk){
			int reCnt = boardService.deleteProc(params);
			result.put("data", true);
		}
		return result;
	}
	
	
	/**
	 * 글상세
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/board/detail.do"})
	public String detail(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {

		
		HashMap<String, Object> detailBoard = boardService.selectBoardDetail(params);
		model.addAttribute("detailBoard", detailBoard);
		
		return "/board/detail";
	}
	
	
	/**
	 * 댓글 저장
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/writeReplyProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> writeReplyProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		
		if(chk){
			int reCnt = replyService.writeProc(params);
			result.put("data", true);
		}
		return result;
	}
	
	
	/**
	 * 게시글 댓글 정보
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/replyList.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> replyList(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();		
		HashMap<String, Object> data= new HashMap<String, Object>();		
		data.put("totalCount", replyService.selectReplyCount(params));
		data.put("list", replyService.selectReplyList(params));
		result.put("data",data);
		
		return result;
	}
	
	
	/**
	 * 게시글 댓글 삭제
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/replyDeleteProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> replyDeleteProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {

		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		
		if(chk){
			int reCnt = replyService.replyDeleteProc(params);
			result.put("data", true);
		}
		return result;
	}
	
	/**
	 * 좋아요 처리
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/likeProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> likeProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {

		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		
		if(chk){
			int reCnt = likeService.likeProc(params);
			result.put("data", true);
		}
		return result;
	}
	
	/**
	 * 좋아요 리스트
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/board/likeList.do"}, method = RequestMethod.POST)	
	public @ResponseBody HashMap<String, Object> likeList(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {

		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		
		
		if(chk){
			HashMap<String, Object> data = new HashMap<String, Object>();
			data.put("count", likeService.selectLikeCount(params));
			data.put("LIKE_YN", likeService.selectLikeSelf(params));
			result.put("data", data);
		}
		return result;
	}
	
	
	
}
