from django.contrib.auth.models import User, Group

def create_user_with_group(username, password, email, group_name):
    # Create the user
    user = User.objects.create_user(username=username, password=password, email= email)
    
    # Retrieve the group or create a new group if it doesn't exist
    group, created = Group.objects.get_or_create(name=group_name)

    # Assign the user to the group
    user.groups.add(group)
    return user
