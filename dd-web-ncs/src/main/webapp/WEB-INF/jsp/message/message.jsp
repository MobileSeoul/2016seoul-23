<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!doctype html>
<html lang="ko-KR">
<head>
<c:set var="message" value="${HTMLMessage.message}" />
<c:set var="href" value="${HTMLMessage.href}" />
<c:if test="${HTMLMessage == null or HTMLMessage.message == null or HTMLMessage.message == ''}">
	<c:set var="message" value="처리되었습니다." />
</c:if>
<c:if test="${HTMLMessage == null or HTMLMessage.href == null or HTMLMessage.href == '' or HTMLMessage.href == 'null'}">
	<c:set var="href" value="/" />
</c:if>
	<meta charset="utf-8" />
	<title>${message}</title>
</head>
<body>

<div id="wrap">



<%@include file="/WEB-INF/jsp/common/footer.jsp" %>
<c:if test="${HTMLMessage != null and HTMLMessage.message != null and HTMLMessage.message ne ''}">
	<script type="text/javascript">
		alert("${HTMLMessage.message}");	
	</script>
</c:if>
<c:if test="${HTMLMessage != null and HTMLMessage.target eq 'BACK'}">
	<script type="text/javascript">
		window.history.back();
	</script>
</c:if>
<c:if test="${params.refer != null and params.refer eq '/sso_index.jsp'}">
<script type="text/javascript">
		parent.location.reload();
	</script>
</c:if>
<c:if test="${params.refer != null and params.refer eq '//'}">
<script type="text/javascript">
		window.location.replace('/index.do');			
	</script>
</c:if>
	<script type="text/javascript">
		window.location.replace('${href}');	
	</script>
	
</body>

</html>