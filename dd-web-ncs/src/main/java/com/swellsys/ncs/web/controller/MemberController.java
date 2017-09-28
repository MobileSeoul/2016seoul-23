package com.swellsys.ncs.web.controller;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.playthm.core.util.CookUtil;
import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.GMailUtil;
import org.playthm.core.util.RandomUtil;
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

import com.swellsys.ncs.service.MemberService;
import com.swellsys.ncs.web.util.FileUploadUtil;




@Controller
public class MemberController extends BaseController {
	
	@Autowired
	private ServletContext context;
	
	@Autowired
	private MemberService memberService;
	
	@Autowired
	private FileUploadUtil fileUploadUtil;
	
	/**
	 * 로그인화면
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/index.do","/member/login.do"})
	public String login(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		Map<String, Object> userMap = getUserSession(request);
		if(userMap != null){
			return "redirect:/main/main.do";
		}else{
			return "member/login";	
		}
		
	}

	/**
	 * 로그인
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/member/loginProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> LoginProc(Model model, HttpServletRequest request, HttpServletResponse response, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		String msg = "";
		int userCnt = memberService.selectMemberLoginCheck(params);
		if(userCnt == 0){
			chk = false;
			msg = "아이디 또는 패스워드가 올바르지 않습니다.";
		}
		
		
		if(chk){
			HashMap<String, Object> user = memberService.selectMemberLogin(params);	
			request.getSession().setAttribute("USER", user);
			
			String autologin = FormatUtil.toString(params.get("autologin"));
			if(autologin.equals("Y")){
				String mm_id = FormatUtil.toString(params.get("mm_id"));
				
				String mm_rand_seed = FormatUtil.toString(user.get("MM_RAND_SEED"));  
				if(mm_rand_seed.equals("")){
					mm_rand_seed =  RandomUtil.RandomString(20);	
				}
				
				params.put("mm_rand_seed", mm_rand_seed);
				memberService.updateMemberRandSeq(params);
				
				CookUtil.setCookie(response, "userIdC", mm_id);
				CookUtil.setCookie(response, "userRandSeedC", mm_rand_seed);
			}
		}
		
		result.put("data", chk);
		result.put("msg", msg);
		
		
		return result;
	}
	
	
	/**
	 * 회원가입
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/member/join.do"})
	public String join(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		return "member/join";
	}

	
	
	/**
	 * 회원가입 - 일반사용자
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/member/join_u.do"})
	public String join_u(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		return "member/join_u";
	}
	
	
	/**
	 * 회원가입 - 재능수혜자
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/member/join_c.do"})
	public String join_c(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		return "member/join_c";
	}
	
	
	/**
	 * 아이디 중복검사
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/member/idCheck.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> idCheck(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		int cnt = memberService.selectMemberCount(params);
		
		if(cnt == 0){
			result.put("data", true);
		}else{
			result.put("data", false);
			result.put("msg", "이미 가입되어 있는 아이디 입니다.");
		}
		return result;
	}
	
	/**
	 * 아이디 중복검사
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/member/emailCheck.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> emailCheck(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		int cnt = memberService.selectEmailCount(params);
		
		if(cnt == 0){
			result.put("data", true);
		}else{
			result.put("data", false);
			result.put("msg", "이미 가입되어 있는 이메일 입니다.");
		}
		return result;
	}
	

	/**
	 * 회원 사진 업로드
	 * @param model
	 * @param request
	 * @param params
	 * @param multiRequest
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/member/fileupload.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> fileupload(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params,MultipartHttpServletRequest multiRequest) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		
		
		// Upload Files
		final Map<String, MultipartFile> files = multiRequest.getFileMap();
		List<HashMap<String, Object>> rsFileMap = fileUploadUtil.fileUpload(files,
				context.getRealPath("/") + "files", "profile" + File.separator);

		if (rsFileMap.size() > 0) {
			result.put("data", true);
			result.put("file",rsFileMap);
		}else{
			result.put("data", false);
			result.put("msg", "등록할 사진정보가 없습니다.");
			
		}
		return result;
	}
	
	
	/**
	 * 회원가입처리
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/member/joinProc.do"}, method = RequestMethod.POST)
	public @ResponseBody HashMap<String, Object> joinProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		boolean chk = true;
		int cnt = memberService.selectMemberCount(params);
		
		String logincheck = FormatUtil.toString(params.get("logincheck"));
		if(logincheck.equals("Y")){
			params.put("not_mm_seq",params.get("mm_seq"));
		}
			
		
		if(!logincheck.equals("Y")){
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
			if(logincheck.equals("Y")){
				HashMap<String, Object> user = memberService.selectMemberLogin(params);
				request.getSession().setAttribute("USER", user);
			}
			result.put("data", true);
		}
		return result;
	}
	
	/**
	 * 아이디 비밀번호 찾기
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/member/find.do"})
	public String find(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {

		return "member/find";
	}
	
	/**
	 * 아이디 찾기결과
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/member/findIdProc.do"}, method = RequestMethod.POST)	
	public @ResponseBody HashMap<String, Object> findIdProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		
		HashMap<String, Object> result = new HashMap<String, Object>();
		HashMap<String, Object> reMap = memberService.selectMemberFind(params);
		if(reMap == null){
			result.put("data", false);
			result.put("msg", "이름 또는 메일 주소를 확인해주세요.");			
		}else{
			result.put("data", true);
			result.put("user", reMap);			
		}
		return result;
	}
	
	
	/**
	 * 비밀번호 찾기
	 * @param model
	 * @param request
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = {"/member/findPwProc.do"}, method = RequestMethod.POST)	
	public @ResponseBody HashMap<String, Object> findPwProc(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		HashMap<String, Object> result = new HashMap<String, Object>();
		
		result =memberService.selectMemberFindPwProc(params);
		return result;
	}
	
	/**
	 * 로그아웃
	 * @param model
	 * @param request
	 * @param response
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping({"/member/logout.do"})
	public String logout(Model model, HttpServletRequest request, HttpServletResponse response, @RequestParam HashMap<String, Object> params) throws Exception {
		
		CookUtil.removeAllCookie(request, response);		
		
		request.getSession().removeAttribute("USER");
		request.getSession().invalidate();
		
		return "redirect:/index.do";
	}
	
	@RequestMapping({"/member/logout1.do"})
	public String logout1(Model model, HttpServletRequest request, @RequestParam HashMap<String, Object> params) throws Exception {
		request.getSession().removeAttribute("USER");
		request.getSession().invalidate();

		return "redirect:/index.do";
	}
	
}
