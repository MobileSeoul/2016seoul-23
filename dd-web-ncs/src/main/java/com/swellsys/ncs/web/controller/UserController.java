package com.swellsys.ncs.web.controller;

import java.io.File;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.playthm.core.model.HTMLMessage;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.swellsys.ncs.service.BoardService;
import com.swellsys.ncs.service.CategoryService;
import com.swellsys.ncs.service.MemberService;
import com.swellsys.ncs.web.util.FileUploadUtil;


@Controller
public class UserController extends BaseController {
	{
		pageAuth.put("USER", PageAuth.AUTH);
	}
	
	@Autowired
	private ServletContext context;
	
	@Autowired
	private MemberService memberService;
	
	@Autowired
	private CategoryService categoryService;	
	
	@Autowired
	private FileUploadUtil fileUploadUtil;
	
		
	/**
	 * 회원가입
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/user/modify.do"})
	public String join(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		
		String mm_type = this.getUserSessionStringValue(request, "MM_TYPE");
		model.addAttribute("LoginCheck", "Y");
		if(mm_type.equals("C")){	//기부 단체			
			return "member/join_c";
		}else if(mm_type.equals("U")){		//개인
			
			model.addAttribute("categoryList", categoryService.selectCategory(params));
			
			return "member/join_u";
		}
		return "";
	}

	
	
	
	
	/**
	 * 회원가입처리
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/user/joinProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> joinProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		int cnt = memberService.selectMemberCount(params);
		if(cnt > 0){
			chk = false;
			result.put("data", false);
			result.put("msg", "이미 가입된 회원 아이디입니다.");
			
		}
		
		if(chk){
			cnt = memberService.selectEmailCount(params);
			if(cnt > 0){
				chk = false;
				result.put("data", false);
				result.put("msg", "이미 가입된 이메일주소입니다.");
			}
		}
		
		if(chk){
			cnt = memberService.selectHpCount(params);
			if(cnt > 0){
				chk = false;
				result.put("data", false);
				result.put("msg", "이미 가입된 연락처입니다.");
			}
		}
		
		if(chk){
			int reCnt = memberService.joinProc(params);
			result.put("data", true);
		}
		return result;
	}
}
