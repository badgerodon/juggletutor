<div id="trick-watch">
<% if (submissions.length) { %>
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
					<th>User</th>
					<td>
						<a href="/profile/<%-submission.user.id%>">
							<%-submission.user.name%>
						</a>
					</td>
				</tr>
				<tr>
					<th>Date</th>
					<td><%-Format.date(submission.date)%></td>
				</tr>
				<tr>
					<th>Rating</th>
					<td>
						<i class="icon-star-empty"></i>
						<i class="icon-star-empty"></i>
						<i class="icon-star-empty"></i>
						<i class="icon-star-empty"></i>
						<i class="icon-star-empty"></i>
					</td>
				</tr>
			</table>
	<% }) %>
<% } else { %>
	No Videos Available
<% } %>
</div>
