package org.playthm.module.aop;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.aspectj.lang.ProceedingJoinPoint;
import org.playthm.core.aop.PlayAspectForController;
import org.playthm.core.controller.PlayBaseController;
import org.playthm.core.model.PageAuth;
import org.playthm.core.util.CookUtil;
import org.playthm.core.util.FormatUtil;
import org.playthm.module.util.CommonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;

import com.swellsys.ncs.service.CodeService;
import com.swellsys.ncs.service.MemberService;

/**
 *
 *
 */
public class AspectForController extends PlayAspectForController {
	
	@Autowired
	private CodeService codeService;
	
	@Autowired
	private MemberService memberService;
	
	
	
	
	@Override
	protected boolean beforeAction(ProceedingJoinPoint pjp, Map<String, Object> pjpMap) throws Exception {
		PlayBaseController controller = (PlayBaseController)pjpMap.get("controller");
		HttpServletRequest request = (HttpServletRequest)pjpMap.get("request");
		HttpServletResponse response = (HttpServletResponse)pjpMap.get("response");
		Model model = (Model)pjpMap.get("model");
		@SuppressWarnings("unchecked")
		HashMap<String, Object> params = (HashMap<String, Object>)pjpMap.get("params");
		@SuppressWarnings("unchecked")
		HashMap<String, Object> user = (HashMap<String, Object>)request.getSession().getAttribute("USER");
		
		CommonUtil.CODE_LIST = codeService.selectCodeList(params);
		
		
		CommonUtil.systemSettingUpdate(params, null);
		
		
		if(user != null){
			params.put("mm_seq", user == null ? "" : FormatUtil.toString(user.get("MM_SEQ")));
			params.put("mm_id", user == null ? "" : FormatUtil.toString(user.get("MM_ID")));	
		}else{
			
			String mm_id = CookUtil.getCookie(request, "userIdC");
			String mm_rand_seed = CookUtil.getCookie(request, "userRandSeedC");
			
			if(!mm_id.equals("") && !mm_rand_seed.equals("")){
				HashMap<String, Object> chkMap = new HashMap<String, Object>();
				chkMap.put("mm_id", mm_id);
				chkMap.put("mm_rand_seed", mm_rand_seed);
				int randCheck = memberService.selectMemberLoginRandCheck(chkMap);
				if(randCheck > 0){
					user = memberService.selectMemberLogin(chkMap);
					request.getSession().setAttribute("USER", user);
					params.put("mm_seq", user.get("MM_SEQ"));
					params.put("mm_id", user.get("MM_ID"));	
				}
			}
		}
		
		String refererUrl = request.getHeader("referer");
		params.put("refererUrl", refererUrl);
		
		if (user == null) {
			if (controller.getPageAuth().get("USER").getValue() > PageAuth.OPEN.getValue()	) {
				pjpMap.put("returnObject", "member/login");
				return false;
			}
		} 
		/*else {
			if ((controller.getPageAuth().get("USER").getValue() == PageAuth.DENY.getValue() && "S".equals(user.get("USER_TYPE")))
					|| (controller.getPageAuth().get("USER-P").getValue() == PageAuth.DENY.getValue() && "P".equals(user.get("USER_TYPE")))
					|| (controller.getPageAuth().get("ADMIN").getValue() == PageAuth.DENY.getValue() && "A".equals(user.get("USER_TYPE")))) {
				pjpMap.put("returnObject", "message/auth");
				return false;
			}
		}*/
		
		return true;
	}

	/**
	 *
	 */
	@Override
	protected boolean afterAction(ProceedingJoinPoint pjp, Map<String, Object> pjpMap) throws Exception {
		// HttpServletRequest request = (HttpServletRequest)pjpMap.get("request");
		// HttpServletResponse response = (HttpServletResponse)pjpMap.get("response");
		// Model model = (Model)pjpMap.get("model");
		// Map<String, Object> params = (Map<String, Object>)pjpMap.get("params");

		return true;
	}
}
