package com.swellsys.ncs.mapper;

import java.util.HashMap;
import java.util.List;

import org.playthm.core.annotation.Mapper;


@Mapper
public interface CodeMapper {

	public HashMap<String, Object> selectCode(HashMap<String, Object> params) throws Exception;
	public List<HashMap<String, Object>> selectCodeList(HashMap<String, Object> params) throws Exception;
}
