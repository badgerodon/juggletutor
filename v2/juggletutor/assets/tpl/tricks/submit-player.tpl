<div id="player"></div>
<h3>Your Submission</h3>
<table>
	<tr>
		<th>Status: </th>
		<td>
		<% if (status === Constants.submitted) { %>
			<i class="icon-legal"></i> Under Review
		<% } else if (status === Constants.accepted) { %>
			<i class="icon-trophy"></i> Accepted
		<% } else if (status === Constants.rejected) { %>
			<i class="icon-exclamation-sign"></i> Rejected
		<% } %>
		</td>
	</tr>
	<tr>
		<th>Date: </th>
		<td><%-Format.date(date)%></td>
	</tr>
</table>
<a class="button" href="#">Resubmit</a>
<br style="clear: both">
