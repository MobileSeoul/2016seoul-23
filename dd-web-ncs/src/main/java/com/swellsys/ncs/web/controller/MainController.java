package com.swellsys.ncs.web.controller;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

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

import com.swellsys.ncs.service.BoardService;
import com.swellsys.ncs.service.MemberService;


@Controller
public class MainController extends BaseController {
	{
		pageAuth.put("USER", PageAuth.AUTH);
	}
	
	@Autowired
	private BoardService boardService;
	
	/**
	 * 메인화면
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/main/main.do"})
	public String main(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		return "/main/main";
	}
}
