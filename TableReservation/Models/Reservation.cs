namespace TableReservation.Models;

public class Reservation
{
    public int reservation_Id { get; set; }
    public string reservation_status { get; set; }
    public string reserved_by { get; set; }
    public string Table_Id { get; set; }
    public string reservedByFirstName { get; set; }
    public string reservedByLastName { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
}