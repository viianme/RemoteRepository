<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>

<script src="resource/js/jquery/jquery-3.2.1.min.js"></script>
<script src="resource/js/util/FormUtil.js"></script>
<script src="resource/js/util/DateUtil.js"></script>
<script src="resource/js/util/DialogUtil.js"></script>
<script>
	$(document).ready(function(){
			
	});
	
	
	function doSubmit(){
		formUtil.submitTo({
			url : "First",
			dataObj: {name:"Sammy",sex:"female",age:"18"},
			async: true,
			onSuccess: function(responseBean) {
			}
		});
	}

</script>



<body>
	<input type="button" name="submit" id="submit" value="執行" onclick="doSubmit()">



</body>
</html>