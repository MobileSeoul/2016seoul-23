package com.swellsys.ncs.web.aop;

import java.util.HashMap;
import java.util.Map;

import org.aspectj.lang.ProceedingJoinPoint;
import org.playthm.module.aop.AspectForController;
import org.springframework.stereotype.Service;

@Service
public class NcsAspectForController extends AspectForController {

	@SuppressWarnings("unchecked")
	@Override
	protected boolean afterAction(ProceedingJoinPoint pjp, Map<String, Object> pjpMap) throws Exception {
		((HashMap<String, Object>)pjpMap.get("params")).remove("board_name");

		return super.afterAction(pjp, pjpMap);
	}
}
