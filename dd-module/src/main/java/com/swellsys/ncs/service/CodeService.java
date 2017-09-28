package com.swellsys.ncs.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swellsys.ncs.mapper.CodeMapper;

@Service("comCodeService")
public class CodeService {

	@Autowired
	CodeMapper mapper;

	public HashMap<String, Object> selectCode(HashMap<String, Object> params) throws Exception {
		return mapper.selectCode(params);
	}
	
	public List<HashMap<String, Object>> selectCodeList(HashMap<String, Object> params) throws Exception {
		return mapper.selectCodeList(params);
	}
}
