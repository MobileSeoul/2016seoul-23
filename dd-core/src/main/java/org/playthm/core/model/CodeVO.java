package org.playthm.core.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.playthm.core.util.FormatUtil;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope(value = "application")
public class CodeVO {

	private HashMap<String, List<HashMap<String, Object>>> codeMap;
	
	public CodeVO() {
		codeMap = new HashMap<String, List<HashMap<String, Object>>>();
	}

	public void setCodeList(List<HashMap<String, Object>> codeList) {
		if (codeList != null) {
			this.clear();
			
			for (int i = 0; i < codeList.size(); ++i) {
				HashMap<String, Object> map = codeList.get(i);
				
				if (map != null) {
					String codeType = FormatUtil.toString(map.get("PRT_CD"));

					List<HashMap<String, Object>> codeValue = getCodeList(codeType);
					
					if (codeValue == null) {
						codeValue = new ArrayList<HashMap<String, Object>>();
					}
					
					codeValue.add(map);
					setCodeList(codeType, codeValue);
				}
			}
		}
	}
	
	public void setCodeList(String codeType, List<HashMap<String, Object>> codeValue) {
		codeMap.put(codeType, codeValue);
	}
	
	public List<HashMap<String, Object>> getCodeList(String codeType) {
		return codeMap.get(codeType);
	}
	
	public String getCode(String codeType, String codeName) {
		List<HashMap<String, Object>> list = getCodeList(codeType);
		
		for (int i = 0; i < list.size(); ++i) {
			HashMap<String, Object> map = list.get(i);
			
			if (codeName.equals(map.get("NM"))) {
				return FormatUtil.toString(map.get("CD"));
			}
		}
		
		return "";
	}
	
	public String getName(String codeType, String codeValue) {
		List<HashMap<String, Object>> list = getCodeList(codeType);
		
		for (int i = 0; list != null && i < list.size(); ++i) {
			HashMap<String, Object> map = list.get(i);
			
			if (codeValue.equals(map.get("CD"))) {
				return FormatUtil.toString(map.get("NM"));
			}
		}

		return "";
	}
	
	public void clear() {
		codeMap = new HashMap<String, List<HashMap<String, Object>>>();
	}

	@Override
	public String toString() {
		return "CodeVO [codeMap=" + codeMap + "]";
	}
}
