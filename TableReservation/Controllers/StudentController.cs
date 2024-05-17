using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using TableReservation.Models;

namespace TableReservation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    private readonly IConfiguration config;

    public StudentController(IConfiguration config)
    {
        this.config = config;
    }

    [HttpGet("GetUsers")]
    public async Task<ActionResult> GetUsers()
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var users = await conn.QueryAsync<Users>("SELECT * FROM [CPIT405].[dbo].[Users]");
        return Ok(users);
    }

    [HttpGet("GetUserName/{userId}")]
    public async Task<ActionResult> GetUserName(string userId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var user = await conn.QueryFirstOrDefaultAsync<Users>("SELECT FirstName, LastName FROM [CPIT405].[dbo].[Users] WHERE UserId = @UserId", new { UserId = userId });
        if (user != null)
        {
            return Ok(user.FirstName + " " + user.LastName);
        }
        return BadRequest("User not found.");
    }

    [HttpPut("UpdateName/{userId}")]
    public async Task<ActionResult> UpdateName(string userId, string name)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var rowsAffected = await conn.ExecuteAsync("UPDATE [CPIT405].[dbo].[Users] SET Name = @Name WHERE UserId = @UserId", new { Name = name, UserId = userId });
        if (rowsAffected > 0)
        {
            return Ok("Name updated successfully!");
        }
        return BadRequest("Failed to update name.");
    }

    [HttpDelete("DeleteUser/{userId}")]
    public async Task<ActionResult> DeleteUser(string userId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var rowsAffected = await conn.ExecuteAsync("DELETE FROM [CPIT405].[dbo].[Users] WHERE UserId = @UserId", new { UserId = userId });
        if (rowsAffected > 0)
        {
            return Ok("User deleted successfully!");
        }
        return BadRequest("Failed to delete user.");
    }

    [HttpPost("AddUser")]
    public async Task<ActionResult> AddUser(string userId, string name)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var rowsAffected = await conn.ExecuteAsync("INSERT INTO [CPIT405].[dbo].[Users] (Name, UserId) VALUES (@Name, @UserId)", new { Name = name, UserId = userId });
        if (rowsAffected > 0)
        {
            return Ok("User added successfully!");
        }
        return BadRequest("Failed to add user.");
    }

    [HttpGet("GetUser/{userId}")]
    public async Task<ActionResult> GetUser(string userId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var user = await conn.QueryFirstOrDefaultAsync<Users>("SELECT * FROM [CPIT405].[dbo].[Users] WHERE UserId = @UserId", new { UserId = userId });
        if (user != null)
        {
            return Ok(user);
        }
        return BadRequest("User not found.");
    }

    [HttpGet("GetTables")]
    public async Task<ActionResult> GetTables()
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var tables = await conn.QueryAsync<Tables>("SELECT * FROM [CPIT405].[dbo].[Tables]");
        return Ok(tables);
    }

    [HttpPost("AddTable")]
    public async Task<ActionResult> AddTable(string tableId, string tableNumber, string numChairs)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var rowsAffected = await conn.ExecuteAsync("INSERT INTO [CPIT405].[dbo].[Tables] (Table_Id, Table_number, num_chairs) VALUES (@TableId, @TableNumber, @numChairs)", new { TableId = tableId, TableNumber = tableNumber, NumChairs = numChairs });
        if (rowsAffected > 0)
        {
            return Ok("Table added successfully!");
        }
        return BadRequest("Failed to add table.");
    }

    [HttpPost("AddReservation")]
    public async Task<ActionResult> AddReservation([Required] string reservedBy, [Required] string tableId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        try
        {
            var reservingUser = await conn.QueryFirstOrDefaultAsync<Users>(
                "SELECT FirstName, LastName FROM [CPIT405].[dbo].[Users] WHERE UserId = @UserId",
                new { UserId = reservedBy });

            if (reservingUser == null)
            {
                return BadRequest("User not found.");
            }

            var updateResult = await conn.ExecuteAsync(
                "UPDATE [CPIT405].[dbo].[Tables] SET reserved = 'yes' WHERE Table_Id = @TableId AND reserved = 'no'",
                new { TableId = tableId });

            if (updateResult == 0)
            {
                return BadRequest("Table not found, already reserved, or update failed.");
            }

            var reservationResult = await conn.ExecuteAsync(
                "INSERT INTO [CPIT405].[dbo].[Reservation] (reserved_by, Table_Id, reservedByFirstName, reservedByLastName) VALUES (@ReservedBy, @TableId, @FirstName, @LastName)",
                new { ReservedBy = reservedBy, TableId = tableId, FirstName = reservingUser.FirstName, LastName = reservingUser.LastName });

            if (reservationResult == 0)
            {
                return BadRequest("Failed to add the reservation.");
            }

            return Ok("Reservation added successfully.");
        }
        catch (SqlException ex)
        {
            return BadRequest("Cannot add the reservation: " + ex.Message);
        }
    }

    [HttpDelete("DeleteTable/{tableId}")]
    public async Task<ActionResult> DeleteTable(string tableId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var rowsAffected = await conn.ExecuteAsync("DELETE FROM [CPIT405].[dbo].[Tables] WHERE Table_Id = @TableId", new { TableId = tableId });
        if (rowsAffected > 0)
        {
            return Ok("Table deleted successfully!");
        }
        return BadRequest("Failed to delete table.");
    }

    [HttpGet("GetMyReservations/{userId}")]
    public async Task<ActionResult> GetMyReservations(string userId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var reservations = await conn.QueryAsync<Reservation>(
            "SELECT * FROM [CPIT405].[dbo].[Reservation] WHERE reserved_by = @ReservedBy ORDER BY reservation_Id DESC",
            new { ReservedBy = userId });

        if (reservations.Any())
        {
            return Ok(reservations);
        }
        else
        {
            return BadRequest("You have not made any reservations yet.");
        }
    }
//-------------------------------------------------------------------
    [HttpGet("GetTableById/{tableId}")]
    public async Task<ActionResult> GetTableById(int tableId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var table = await conn.QueryFirstOrDefaultAsync<Tables>(
            "SELECT * FROM [CPIT405].[dbo].[Tables] WHERE Table_Id = @TableId",
            new { TableId = tableId });

        if (table != null)
        {
            return Ok(table);
        }
        else
        {
            return BadRequest("Table with this ID  was not found.");
        }
    }

    
    [HttpPut("UpdateReservationStatus/{reservationId}")]
    public async Task<ActionResult> UpdateReservationStatus(int reservationId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var currentStatus = await conn.QueryFirstOrDefaultAsync<string>(
            "SELECT reservation_status FROM [CPIT405].[dbo].[Reservation] WHERE reservation_Id = @ReservationId",
            new { ReservationId = reservationId });

        if (currentStatus == "confirmed")
        {
            return BadRequest("Reservation is already confirmed.");
        }

        var result = await conn.ExecuteAsync(
            "UPDATE [CPIT405].[dbo].[Reservation] SET reservation_status = 'confirmed', ConfirmedAt = GETDATE() WHERE reservation_Id = @ReservationId",
            new { ReservationId = reservationId });

        if (result > 0)
        {
            return Ok("Reservation status updated to confirmed successfully.");
        }
        return BadRequest("Failed to update reservation status.");
    }

    [HttpGet("GetPendingReservations")]
    public async Task<ActionResult> GetPendingReservations()
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var reservations = await conn.QueryAsync<Reservation>(
            "SELECT * FROM [CPIT405].[dbo].[Reservation] WHERE reservation_status = 'pending' ORDER BY reservation_Id",
            new { });

        if (reservations.Any())
        {
            return Ok(reservations);
        }
        else
        {
            return NotFound("There are no pending reservations.");
        }
    }

    [HttpDelete("CleanupUnconfirmedReservations")]
    public async Task<ActionResult> CleanupUnconfirmedReservations()
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var reservations = await conn.QueryAsync<Reservation>(
            "SELECT * FROM [CPIT405].[dbo].[Reservation] WHERE reservation_status = 'pending' AND DATEDIFF(minute, CreatedAt, GETDATE()) > 5",
            new { });

        if (!reservations.Any())
        {
            return Ok("No unconfirmed reservations to cleanup.");
        }

        foreach (var reservation in reservations)
        {
            await conn.ExecuteAsync(
                "UPDATE [CPIT405].[dbo].[Tables] SET reserved = 'no' WHERE Table_Id = @TableId",
                new { TableId = reservation.Table_Id });

            await conn.ExecuteAsync(
                "DELETE FROM [CPIT405].[dbo].[Reservation] WHERE reservation_Id = @ReservationId",
                new { ReservationId = reservation.reservation_Id });
        }

        return Ok("Unconfirmed reservations cleaned up successfully.");
    }

    [HttpDelete("CleanupConfirmedReservations")]
    public async Task<ActionResult> CleanupConfirmedReservations()
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var reservations = await conn.QueryAsync<Reservation>(
            "SELECT * FROM [CPIT405].[dbo].[Reservation] WHERE reservation_status = 'confirmed' AND ConfirmedAt IS NOT NULL AND DATEDIFF(minute, ConfirmedAt, GETDATE()) > 5",
            new { });

        if (!reservations.Any())
        {
            return Ok("No confirmed reservations to cleanup.");
        }

        foreach (var reservation in reservations)
        {
            await conn.ExecuteAsync(
                "UPDATE [CPIT405].[dbo].[Tables] SET reserved = 'no' WHERE Table_Id = @TableId",
                new { TableId = reservation.Table_Id });

            await conn.ExecuteAsync(
                "DELETE FROM [CPIT405].[dbo].[Reservation] WHERE reservation_Id = @ReservationId",
                new { ReservationId = reservation.reservation_Id });
        }

        return Ok("Confirmed reservations cleaned up successfully.");
    }

    [HttpDelete("DeleteReservation/{reservationId}")]
    public async Task<ActionResult> DeleteReservation(string reservationId)
    {
        using var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        var result = await conn.ExecuteAsync(
            "DELETE FROM [CPIT405].[dbo].[Reservation] WHERE reservation_Id = @ReservationId",
            new { ReservationId = reservationId });

        if (result > 0)
        {
            return Ok("Reservation deleted successfully!");
        }
        return NotFound("No reservation found with the specified ID or it might have already been deleted.");
    }
    
    //----------------------------------------------------------------------------
    [HttpGet]
    [Route("api/login")]
    public async Task<IActionResult> LogIn(int userId, string password)
    {
        var conn = new SqlConnection(config.GetConnectionString("DefaultConnection"));
        try
        {
            // It's important to hash passwords in real-world scenarios for security reasons
            // For demonstration, assuming password is plain text as per your DB image
            var res = await conn.QueryFirstOrDefaultAsync<Users>(
                "SELECT * FROM [CPIT405].[dbo].[Users] WHERE UserId = @ID AND Password = @Pass",
                new { ID = userId, Pass = password });

            if (res != null)
            {
                // Login success
                return Ok(res);
            }
            else
            {
                // Login failed, no user found
                return BadRequest("Invalid credentials");
            }
        }
        catch (Exception ex)
        {
            // Log the exception details for troubleshooting
            Console.WriteLine(ex.ToString());  // Log the full exception
            return StatusCode(500, "Server error: " + ex.Message);  // Include the exception message in the response for debugging
        }

    }

}
