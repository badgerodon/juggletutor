<div id="admin-review" class="container">
	<div class="body">
	<% _.each(submissions, function(submission) { %>
		<div class="submission" data-id="<%-submission.id%>">
			<iframe class="youtube-player"
				type="text/html"
				width="350"
				height="213"
				src="https://www.youtube.com/embed/<%-submission.video_id%>"
				frameborder="0"></iframe>
			<table>
				<tr>
					<th>Trick</th>
					<td><%-submission.trick%></td>
				</tr>
				<tr>
					<th>User</th>
					<td><%-submission.user%></td>
				</tr>
				<tr>
					<th>Date</th>
					<td><%-submission.date%></td>
				</tr>
				<tr>
					<th>Criteria</th>
					<td><%=submission.criteria%></td>
				</tr>
			</table>
			<div class="buttons">
				<a href="#" class="large-button approve">
					<i class="icon-thumbs-up"></i>
					Approve
				</a>
				<a href="#" class="large-button approve">
					<i class="icon-thumbs-down"></i>
					Reject
				</a>
			</div>
		</div>
	<% }) %>
		<br style="clear:both;">
	</div>
</div>
