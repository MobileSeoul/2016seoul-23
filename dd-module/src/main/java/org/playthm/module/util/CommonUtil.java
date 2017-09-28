package org.playthm.module.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.playthm.core.model.CodeVO;
import org.playthm.core.util.FormatUtil;

public class CommonUtil {
	public static List<HashMap<String, Object>> CODE_LIST = null;
	
	public static long LOAD_TIME = 0;


	/**
	 *
	 */
	public static void systemSettingUpdate(Map<String, Object> params, Map<String, Object> data) {
		List<HashMap<String, Object>> codeList = new ArrayList<HashMap<String, Object>>();
		
		if (codeList != null) {
			for (int i = 0; i < CommonUtil.CODE_LIST.size(); ++i) {
				HashMap<String, Object> map = CommonUtil.CODE_LIST.get(i);
				codeList.add(map);
			}
		}
		
		CodeVO codeVo = new CodeVO();
		codeVo.setCodeList(codeList);
		params.put("CODE", codeVo);
	}
}
