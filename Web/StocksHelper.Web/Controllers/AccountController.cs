﻿namespace StocksHelper.Web.Controllers
{
	using System.Threading.Tasks;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Identity;
	using Microsoft.AspNetCore.Mvc;

	using StocksHelper.Data.Models;
	using StocksHelper.Web.Infrastructure.Extensions;
	using StocksHelper.Web.ViewModels.Account;

	[AllowAnonymous]
	public class AccountController : BaseController
	{
		private readonly UserManager<ApplicationUser> userManager;

		public AccountController(UserManager<ApplicationUser> userManager)
		{
			this.userManager = userManager;
		}

		[HttpPost]
		public async Task<IActionResult> Register([FromForm]UserRegisterBindingModel model)
		{
			if (model == null || !this.ModelState.IsValid)
			{
				return this.BadRequest(this.ModelState.GetFirstError());
			}

			var user = new ApplicationUser { Email = model.Email, UserName = model.Email };
			var result = await this.userManager.CreateAsync(user, model.Password);

			if (result.Succeeded)
			{
				return this.Ok();
			}

			return this.BadRequest(result.GetFirstError());
		}
	}
}
