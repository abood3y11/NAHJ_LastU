from datetime import datetime, timedelta

def calculate_student_hours(login_times, logout_times):
    """
    Calculate total hours spent by a student in the portal
    
    Args:
        login_times (list): List of datetime objects for login times
        logout_times (list): List of datetime objects for logout times
        
    Returns:
        dict: Dictionary containing total hours and detailed statistics
    """
    if len(login_times) != len(logout_times):
        raise ValueError("Login and logout times must match")
        
    total_duration = timedelta()
    daily_hours = {}
    weekly_hours = {}
    
    for login, logout in zip(login_times, logout_times):
        duration = logout - login
        total_duration += duration
        
        # Track daily hours
        day_key = login.strftime('%Y-%m-%d')
        daily_hours[day_key] = daily_hours.get(day_key, timedelta()) + duration
        
        # Track weekly hours
        week_key = login.strftime('%Y-W%W')
        weekly_hours[week_key] = weekly_hours.get(week_key, timedelta()) + duration
    
    # Convert timedelta to hours
    total_hours = total_duration.total_seconds() / 3600
    daily_hours = {k: v.total_seconds() / 3600 for k, v in daily_hours.items()}
    weekly_hours = {k: v.total_seconds() / 3600 for k, v in weekly_hours.items()}
    
    return {
        "total_hours": round(total_hours, 2),
        "daily_hours": daily_hours,
        "weekly_hours": weekly_hours,
        "average_daily_hours": round(sum(daily_hours.values()) / len(daily_hours) if daily_hours else 0, 2)
    }