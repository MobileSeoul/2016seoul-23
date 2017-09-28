package org.playthm.module.controller;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.playthm.core.controller.PlayBaseController;
import org.playthm.core.model.PageAuth;
import org.playthm.core.util.FormatUtil;

public class BaseController extends PlayBaseController {	

	protected HashMap<String, Object> putUserInfo(HttpServletRequest request, HashMap<String, Object> map) {
		String userNo = getUserSessionStringValue(request, "USER_NO");
		String userType = getUserSessionStringValue(request, "USER_TYPE");
		int userLv = getUserSessionIntValue(request, "USER_LV");
		String userMaj = getUserSessionStringValue(request, "USER_MAJ");

		if ("P".equals(userType)) {
			map.put("auth_no", userNo);
			map.put("user_type", userType);
			map.put("user_lv", userLv);

			if (userLv > 5) {
				//All
			} else if (userLv > 1) {
				map.put("user_maj", userMaj);
				map.put("user_no", userNo);
			} else {
				map.put("user_no", userNo);
				map.put("viewSuffix", "_read");
			}
		} else if ("S".equals(userType)) {
			map.put("user_no", userNo);
			map.put("user_lv", userLv);
			map.put("user_type", userType);
		}

		return map;
	}
	
	
	@SuppressWarnings("unchecked")
	protected Map<String, Object> getUserSession(HttpServletRequest request) {
		return (HashMap<String, Object>)request.getSession().getAttribute("USER");
	}
	
	protected Object getUserSessionValue(HttpServletRequest request, String attibuteName) {
		HashMap<String, Object> user = (HashMap<String, Object>)getUserSession(request);
		return user == null ? null : user.get(attibuteName);
	}
	
	protected String getUserSessionStringValue(HttpServletRequest request, String attibuteName) {
		return FormatUtil.toString(getUserSession(request).get(attibuteName));
	}
	
	protected int getUserSessionIntValue(HttpServletRequest request, String attibuteName) {
		return FormatUtil.toInt(getUserSession(request).get(attibuteName));
	}	
}
