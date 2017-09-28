package org.playthm.core.aop;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.playthm.core.controller.PlayBaseController;
import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.PageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.Model;

@Aspect
public abstract class PlayAspectForController {

	/**
	 *
	 */
	@Resource(name = "config")
	private Properties config;

	/**
	 *
	 */
	@Value("#{config['FRAMEWORK.MSG.INFO']}")
	private String isInfoMessage;


	/**
	 *
	 * @param pjp
	 * @param pjpMap
	 * @return
	 */
	protected abstract boolean beforeAction(ProceedingJoinPoint pjp, Map<String, Object> pjpMap) throws Exception;

	/**
	 *
	 * @param pjp
	 * @param pjpMap
	 * @return
	 */
	protected abstract boolean afterAction(ProceedingJoinPoint pjp, Map<String, Object> pjpMap) throws Exception;

	/**
	 *
	 */
	@Pointcut("execution(* *..*.controller.*..*(..))")
	protected void pointCutForController() {
	}

	/**
	 *
	 * @param pjp
	 * @return
	 * @throws Throwable
	 */
	@SuppressWarnings("unchecked")
	@Around("pointCutForController()")
	private final Object action(ProceedingJoinPoint pjp) throws Throwable {
		PlayBaseController controller = null;
		HttpServletRequest request = null;
		HttpServletResponse response = null;
		Model model = null;
		Map<String, Object> params = null;

		long startTime = System.currentTimeMillis();
		Object returnObject = null;

		StringBuffer report = new StringBuffer();
		StringBuffer reportByController = new StringBuffer();

		if (pjp.getTarget() instanceof PlayBaseController) {
			controller = (PlayBaseController)pjp.getTarget();
		}

		if (controller == null) {
			return pjp.proceed();
		}

		Object[] args = pjp.getArgs();

		for (Object arg : args) {
			if (arg instanceof HttpServletRequest) {
				request = (HttpServletRequest)arg;
			} else if (arg instanceof HttpServletResponse) {
				response = (HttpServletResponse)arg;
			} else if (arg instanceof Model) {
				model = (Model)arg;
			} else if (arg instanceof Map) {
				params = (Map<String, Object>)arg;
			}
		}

		if (request != null && params == null) {
			params = PageUtil.getParameterMap(request);
		}

		if (request != null && model != null) {
			model.addAttribute("paramsSearch", new HashMap<String, Object>(params));
			model.addAttribute("params", params);
			model.addAttribute("report", reportByController);

			boolean havePageNum = false, haveRowCount = false;

			for (String key : params.keySet()) {
				if (key.toLowerCase().matches("(?i)(page|no|num)")) {
					if (FormatUtil.toInt(params.get(key)) < 1) {
						params.put(key, 1);
					}

					havePageNum = true;
				}

				if (key.toLowerCase().matches("(?i)(row|list)(count|size)")) {
					if (FormatUtil.toInt(params.get(key)) < 1) {
						params.put(key, 10);
					}

					haveRowCount = true;
				}
			}

			if (!havePageNum) {
				params.put("page", 1);
			}

			if (!haveRowCount) {
				params.put("rowcount", 10);
			}
		}

		reportInit(report, pjp, request, params);

		HashMap<String, Object> pjpMap = new HashMap<String, Object>();
		pjpMap.put("controller", controller);
		pjpMap.put("request", request);
		pjpMap.put("response", response);
		pjpMap.put("model", model);
		pjpMap.put("params", params);
		pjpMap.put("returnObject", returnObject);
		pjpMap.put("HTMLMessage", null);

		long readyTime = System.currentTimeMillis();
		report.append("started time = " + startTime + "\n");
		report.append("elapsed time(ready) = " + (readyTime - startTime) + "ms\n");

		if (!beforeAction(pjp, pjpMap)) {
			returnObject = getDefaultReturnObject(pjp, (pjpMap.get("returnObject") == null ? "message/before" : pjpMap.get("returnObject").toString()));

			reportFinish(controller, report, reportByController, System.currentTimeMillis() - startTime, params, returnObject, model);

			return returnObject;
		}

		long beforeTime = System.currentTimeMillis();
		report.append("elapsed time(before) = " + (beforeTime - readyTime) + "ms\n");

		Object result = pjp.proceed();

		long proceedTime = System.currentTimeMillis();
		report.append("elapsed time(proceed) = " + (proceedTime - beforeTime) + "ms\n");

		if (!afterAction(pjp, pjpMap)) {
			returnObject = getDefaultReturnObject(pjp, (pjpMap.get("returnObject") == null ? "message/after" : pjpMap.get("returnObject").toString()));

			reportFinish(controller, report, reportByController, System.currentTimeMillis() - startTime, params, returnObject, model);

			return returnObject;
		}

		long afterTime = System.currentTimeMillis();
		report.append("elapsed time(after) = " + (afterTime - proceedTime) + "ms\n");

		if (model != null) {
			model.addAttribute("paging", PageUtil.getPaging(params));

			if (params.get("paging") != null) {
				String[] paging = params.get("paging").toString().split(",");

				for (int i = 0; i < paging.length; ++i) {
					String[] pagingFix = paging[i].split("[*]");

					String pagingPrefix = pagingFix[0];
					String pagingSuffix = "";

					if (pagingFix.length > 1) {
						pagingSuffix = pagingFix[1];
					}

					model.addAttribute(pagingPrefix + "paging" + pagingSuffix, PageUtil.getPaging(params, pagingPrefix, pagingSuffix));
				}
			}
		}


		returnObject = (result == null ? getDefaultReturnObject(pjp, "message/nopage") : result);

		long finishTime = System.currentTimeMillis();
		reportFinish(controller, report, reportByController, finishTime - startTime, params, returnObject, model);

		return result == null ? returnObject : result;
	}


	/**
	 *
	 * @param pjp
	 * @param returnObject
	 * @return
	 */
	protected final Object getDefaultReturnObject(ProceedingJoinPoint pjp, Object returnObject) {
		if (pjp.getSignature().toString().startsWith("String ")) {
			return returnObject.toString();
		} else {
			return returnObject;
		}
	}

	/**
	 *
	 * @param report
	 * @param pjp
	 * @param request
	 * @param params
	 */
	private final void reportInit(StringBuffer report, ProceedingJoinPoint pjp, HttpServletRequest request, Map<String, Object> params) {
		if (isInfoMessage != null && "FALSE".equals(isInfoMessage.toUpperCase())) {
			return;
		}

		report.append("\n################################################################################\n");
		report.append("signature = " + pjp.getSignature() + "\n");
		report.append("uri = " + request.getRequestURI() + "\n");
		report.append("paramsSearch = " + params + "\n");
	}

	/**
	 *
	 * @param controller
	 * @param report
	 * @param reportByController
	 * @param total
	 * @param params
	 * @param returnObject
	 * @param model
	 */
	private final void reportFinish(PlayBaseController controller, StringBuffer report, StringBuffer reportByController, long total, Map<String, Object> params, Object returnObject, Model model) {
		if (isInfoMessage != null && "FALSE".equals(isInfoMessage.toUpperCase())) {
			return;
		}

		if (report == null) {
			return;
		}

		if (model != null) {
			model.asMap().remove("report");
		}

		report.append("elapsed time(total) = " + total + "ms\n");
		report.append("params = " + params + "\n");
		report.append("returnObject = " + returnObject + "\n");

		if (reportByController != null && !"".equals(reportByController.toString())) {
			report.append("\n[Message from Controller]\n");
			report.append(reportByController);
		}

		report.append("################################################################################");

		controller.loggerInfo(report.toString());
	}
}
