from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *  # Import the model
import csv

@receiver(post_save, sender=User)
def export_product_to_csv(sender, instance, created, **kwargs):
    """
    This function is called after a Product instance is saved.
    It writes the product data to a CSV file.
    """
    if created:  # This checks if the instance is newly created
        # Define the path for the CSV file
        csv_file_path = './api/csv_files/user.csv'
        
        try:
            with open(csv_file_path, mode='a', newline='') as file:
                writer = csv.writer(file)
                
                # If the file is empty, write the header
                if file.tell() == 0:
                    writer.writerow(['name', 'email', 'password'])

                # Write the model data as a new row in the CSV
                writer.writerow([instance.name, instance.email, instance.password])
        except Exception as e:
            print(f"Error exporting to CSV: {e}")
