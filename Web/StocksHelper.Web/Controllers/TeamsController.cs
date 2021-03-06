﻿namespace StocksHelper.Web.Controllers
{
	using System;
	using System.Threading.Tasks;
	using Microsoft.AspNetCore.Mvc;
	using StocksHelper.Services.DataServices;
	using StocksHelper.Services.Models.Teams;
	using StocksHelper.Web.Infrastructure.Extensions;
	using StocksHelper.Web.Models;

	public class TeamsController : BaseController
	{
		private readonly ITeamsService teamsService;

		public TeamsController(ITeamsService teamsService)
		{
			this.teamsService = teamsService;
		}

		[HttpGet]
		public IActionResult Search(string name)
		{
			if (String.IsNullOrEmpty(name))
				return BadRequest("Please enter a valid team name.");

			var teams = this.teamsService.Search(name);
			return Json(teams);
		}

		[HttpPost]
		public async Task<IActionResult> Create([FromBody]TeamInputModel inputModel)
		{
			if (!this.ModelState.IsValid)
				return BadRequest(ModelState);

			string loggedUserId = this.User.GetUserId();
			TeamViewModel team = await this.teamsService.Create(inputModel, loggedUserId);
			
			return Ok(team);
		}

		[HttpGet]
		public IActionResult FetchMyTeams()
		{
			string loggedUserId = this.User.GetUserId();
			var myTeams = this.teamsService.GetMyTeams(loggedUserId);

			return Ok(myTeams);
		}

		[HttpGet]
		public IActionResult Load(int id)
		{
			string loggedUserId = this.User.GetUserId();
			var team = this.teamsService.LoadTeam(id, loggedUserId);

			return Ok(team);
		}

		[HttpGet]
		public IActionResult SuggestMember(string input)
		{
			string loggedUserId = this.User.GetUserId();
			var suggestions = this.teamsService.GetMemberSuggestions(input, loggedUserId);

			return Ok(suggestions);
		}

		[HttpPost]
		public async Task<IActionResult> Leave([FromBody]LeaveTeamInputModel model)
		{
			string loggedUserId = this.User.GetUserId();
			var result = await this.teamsService.Leave(loggedUserId, model.Id);

			if (result > 0)
				return Ok(new { teamId = model.Id });

			return BadRequest("Team was not found.");
		}
	}
}