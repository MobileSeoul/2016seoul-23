package com.swellsys.ncs.web.controller;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.playthm.core.model.HTMLMessage;
import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.PageUtil;
import org.playthm.module.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;




@Controller
public class ManagerController extends BaseController {
	
	
	
	@RequestMapping({"/managers/manager1.do"})
	public String manager1(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		return "managers/manager1";
	}
}
