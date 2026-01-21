using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SV.Services;

namespace SV.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController(GameService svc) : ControllerBase
    {
        private readonly GameService _svc = svc;

        [HttpGet("Bot/{PlayerOne}")]
        public ActionResult<string> Bot(
            [FromRoute(Name = "PlayerOne")]
            string one
        )
        {
            if (!_svc.IsValidHand(one))
                return BadRequest("Invalid choice.");

            var str = _svc.Check(one, _svc.RandomChoice());
            if (str == null) return BadRequest();

            return str;
        }

        [HttpGet("Duo/{PlayerOne}/{PlayerTwo}")]
        public ActionResult<string> Duo(
            [FromRoute(Name = "PlayerOne")]
            string one,
            [FromRoute(Name = "PlayerTwo")]
            string two
        )
        {
            if (!_svc.IsValidHand(one))
                return BadRequest("Invalid choice for Player 1.");
            if (!_svc.IsValidHand(two))
                return BadRequest("Invalid choice for Player 2.");

            var str = _svc.Check(one, two);
            if (str == null) return BadRequest();

            return str;
        }
    }
}
