package org.playthm.core.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.playthm.core.model.PageAuth;
import org.playthm.core.model.PageProtocol;
import org.playthm.core.model.SiteType;
import org.playthm.core.util.FormatUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;


public class PlayBaseController {

	private final Logger log = LoggerFactory.getLogger(getClass());

	@Autowired
	public HttpServletRequest request;

	protected SiteType siteType = SiteType.NORMAL;

	protected HashMap<String, PageAuth> pageAuth = new HashMap<String, PageAuth>();

	protected PageProtocol pageProtocol = PageProtocol.HTTP;
	{
		pageAuth.put("USER", PageAuth.OPEN);
		pageAuth.put("ADMIN", PageAuth.OPEN);
	}

	/**
	 *
	 * @param message
	 */
	public void loggerInfo(String message) {
		log.info(message);
	}

	/**
	 *
	 * @param message
	 */
	public void loggerDebug(String message) {
		log.debug(message);
	}

	/**
	 *
	 * @param message
	 */
	public void loggerWarn(String message) {
		log.warn(message);
	}

	/**
	 *
	 * @param message
	 */
	public void loggerError(String message) {
		log.error(message);
	}

	/**
	 *
	 * @param model
	 * @param message
	 */
	protected final void addLoggerInfo(Model model, String message) {
		((StringBuffer)model.asMap().get("report")).append(message + "\n");
	}

	/**
	 *
	 * @return
	 */
	public SiteType getSiteType() {
		return siteType;
	}

	/**
	 *
	 * @return
	 */
	public HashMap<String, PageAuth> getPageAuth() {
		return pageAuth;
	}

	/**
	 *
	 * @return
	 */
	public PageProtocol getPageProtocol() {
		return pageProtocol;
	}
	
	public String getUserIp(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For");
		
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
		    ip = request.getRemoteAddr();
		}
		
		return ip;
	}
}
