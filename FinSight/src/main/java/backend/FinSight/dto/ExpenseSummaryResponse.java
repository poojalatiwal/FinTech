package backend.FinSight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExpenseSummaryResponse {

    private double total;

    private double food;

    private double travel;

    private double shopping;
    private double agriculture;
    private double other;

}