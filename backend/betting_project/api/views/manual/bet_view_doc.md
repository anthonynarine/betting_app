
### BetViewset Documentation

#### Overview
The `BetViewset` class in the betting application handles the creation, retrieval, updating, and deletion of bet instances. It includes custom logic for associating bets with users, placing bets, and ensuring bets are not placed or deleted after the associated event has started.

#### Methods

1. **get_queryset**
   - **Purpose**: Returns a queryset of bet instances.
   - **Logic**: If the user is a staff member, all bet instances are returned. Otherwise, only the bets associated with the current user are returned.
   - **Usage**: Automatically used by the viewset to determine the list of bets to display.

2. **perform_create**
   - **Purpose**: Customizes the creation of a new bet instance.
   - **Logic**: Associates the new bet with the currently authenticated user.
   - **Usage**: Called internally when a new bet is created via a POST request.

3. **place_bet (Custom Action)**
   - **Purpose**: Provides a custom endpoint for placing bets.
   - **Logic**: Validates the event associated with the bet and ensures it hasn't started. Saves the bet if valid.
   - **Usage**: Accessed via a POST request to the `place_bet` endpoint.

4. **destroy**
   - **Purpose**: Customizes the deletion of a bet instance.
   - **Logic**: Prevents the deletion of a bet if the associated event has started.
   - **Usage**: Called internally when a DELETE request is made for a specific bet instance.

#### Additional Notes
- **Authentication and Permissions**: The viewset requires users to be authenticated. Staff members have additional privileges.
- **Event Validation**: The `place_bet` method includes checks to ensure the event associated with a bet exists and hasn't started.
- **Error Handling**: Custom error messages are provided for various validation failures.

#### Example Requests
- **Place Bet**:
  ```http
  POST /api/bets/place_bet/
  Content-Type: application/json
  Authorization: Bearer <token>

  {
    "event": 1,
    "amount": 50
  }
  ```
- **Delete Bet**:
  ```http
  DELETE /api/bets/1/
  Authorization: Bearer <token>
  ```

