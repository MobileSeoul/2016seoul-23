package com.swellsys.ncs.service;

import java.util.HashMap;
import java.util.List;

import org.apache.poi.util.StringUtil;
import org.playthm.core.model.CodeVO;
import org.playthm.core.util.FormatUtil;
import org.playthm.core.util.GMailUtil;
import org.playthm.core.util.RandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.swellsys.ncs.mapper.MemberMapper;

@Service("memberService")
public class MemberService {

	@Autowired
	MemberMapper mapper;
	
	@Autowired
	CategoryService categoryService;

	
	
	/**
	 * 회원 로그인 체크
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectMemberLoginCheck(HashMap<String, Object> params) throws Exception {
		return mapper.selectMemberLoginCheck(params);
	}
	
	
	/**
	 * 회원 로그인
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> selectMemberLogin(HashMap<String, Object> params) throws Exception {
		return mapper.selectMemberLogin(params);
	}
	
	/**
	 * 회원 아이디 가입여부 확인
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectMemberCount(HashMap<String, Object> params) throws Exception {
		return mapper.selectMemberCount(params);
	}
	
	/**
	 * 회원 이메일 가입여부 확인
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectEmailCount(HashMap<String, Object> params) throws Exception {
		return mapper.selectEmailCount(params);
	}
	
	/**
	 * 회원 전화번호 확인 
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectHpCount(HashMap<String, Object> params) throws Exception {
		return mapper.selectHpCount(params);
	}
	
	
	
	/**
	 * 회원 가입 처리
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int joinProc(HashMap<String, Object> params) throws Exception {
		int result = 0;
		
		String logincheck = FormatUtil.toString(params.get("logincheck"));
		if(logincheck.equals("Y")){
			result += this.updateMember(params);
			categoryService.deleteCategory(params);
		}else{
			result += this.insertMember(params);
		}
		
		
		
		String mm_type = FormatUtil.toString(params.get("mm_type"));
		if(mm_type.equals("U")){
			CodeVO codeVo = (CodeVO)params.get("CODE");
			List<HashMap<String, Object>> cateList = codeVo.getCodeList("MC_CATE_CODE");
			for(int i=1; i<=cateList.size(); i++){				
				String mc_cate_code = FormatUtil.toString(params.get("mc_cate_code__" + i));
				if(!mc_cate_code.equals("")){
					params.put("mc_cate_code",mc_cate_code);
					categoryService.insertCategory(params);
				}	
			}
		}
		
		return result;
	}
	
	/**
	 * 회원 가입 - 회원 정보
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int insertMember(HashMap<String, Object> params) throws Exception {
		return mapper.insertMember(params);
	}
	
	/**
	 * 회원정보 수정
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int updateMember(HashMap<String, Object> params) throws Exception {
		return mapper.updateMember(params);
	}
	
	/**
	 * 자동로그인 rand값 저장
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int updateMemberRandSeq(HashMap<String, Object> params) throws Exception {
		return mapper.updateMemberRandSeq(params);
	}
	
	
	/**
	 * 자동 로그인 값 로그인 확인
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int selectMemberLoginRandCheck(HashMap<String, Object> params) throws Exception {
		return mapper.selectMemberLoginRandCheck(params);
	}
	
	
	/**
	 * 회원정보 찾기
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> selectMemberFind(HashMap<String, Object> params) throws Exception {
		return mapper.selectMemberFind(params);
	}
	
	/**
	 * 회원정보 패스워드
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> selectMemberFindPw(HashMap<String, Object> params) throws Exception {
		return mapper.selectMemberFindPw(params);
	}
	
	
	/**
	 * 회원 패스워드 변경
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public int updateMemberPw(HashMap<String, Object> params) throws Exception {
		return mapper.updateMemberPw(params);
	}
	
	
	/**
	 * 회원정보 패스워드 찾기
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public HashMap<String, Object> selectMemberFindPwProc(HashMap<String, Object> params) throws Exception {
		HashMap<String, Object> reMap = new HashMap<String, Object>();
		boolean data = true;
		String msg = "";
		HashMap<String, Object> user = this.selectMemberFindPw(params);
		if(user == null){
			data = false; 
			msg = "정보를 확인해주세요.";
		}else{
			String mm_pw =  RandomUtil.RandomString(6);
			params.put("mm_pw", mm_pw);
			this.updateMemberPw(params);
			
			
			
			String mm_name = FormatUtil.toString(user.get("MM_NAME"));
			String subject = mm_name + "님의 재능나눔에서 임시 패스워드가 재발행되었습니다.";
			String message = "<html> "
							+	"	<head> "
							+	"	</head> "
							+	"	<body> "
							+	"	<table> "
							+	"		<tr> "
							+	"				<td>" + mm_name + "님의 임시 패스워드는 <span style=\"font-weight:bold;color:blue;\">" + mm_pw + "</span> 입니다</td> "
							+	"		</tr> "
							+	"	</table> "
							+	"</body> "
							+	"</html>";
			
			data = GMailUtil.sendMail(FormatUtil.toString(user.get("MM_EMAIL")),subject ,message);
			if(!data){
				throw new Exception(); 
			}
		}
		reMap.put("data", data);
		reMap.put("msg", msg);
		return reMap;
	}
}
