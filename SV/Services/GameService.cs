using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SV.Services
{
    public class GameService
    {
        private readonly Random _rng = new();
        private readonly string[] hands = ["rock", "paper", "scissors", "lizard", "spock"];

        public string RandomChoice()
        {
            return hands[_rng.Next(hands.Length)];
        }

        public bool IsValidHand(string str)
        {
            return hands.Any(e => e.Equals(str, StringComparison.CurrentCultureIgnoreCase));
        }

        public string? Check(string one, string two)
        {
            string? str = null;
            one = one.Trim().ToLower();
            two = two.Trim().ToLower();

            if (one == two) return "Tie!";

            for (int i = 1; i <= 2; i++)
            {
                str = (one, two) switch
                {
                    ("rock",   "scissors") => "Rock crushes Scissors.",
                    ("rock",     "lizard") => "Rock crushes Lizard.",
                    ("paper",      "rock") => "Paper covers Rock.",
                    ("paper",     "spock") => "Paper disproves Spock.",
                    ("scissors",  "paper") => "Scissors cuts Paper.",
                    ("scissors", "lizard") => "Scissors decapitates Lizard.",
                    ("lizard",    "paper") => "Lizard eats Paper.",
                    ("lizard",    "spock") => "Lizard poisons Spock.",
                    ("spock",      "rock") => "Spock vaporizes Rock.",
                    ("spock",  "scissors") => "Spock smashes Scissors.",
                    _ => null,
                };

                if (str != null)
                {
                    str = $"Player {i} Wins!\n\n" + str;
                    break;
                }

                (one, two) = (two, one); // * SWAP
            }

            return str;
        }
    }
}
