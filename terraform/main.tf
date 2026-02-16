# 1. Terraform Configuration & Providers
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0" # Ensures compatibility with Azure's stable API
    }
  }
}

provider "azurerm" {
  features {} # Required by the AzureRM provider
}

# 2. Resource Group (The "Folder" for your cloud resources)
resource "azurerm_resource_group" "hasib_platform" {
  name     = "hasib-platform-rg"
  location = "West US 2" # Choose your closest region
}

# 3. Azure Kubernetes Service (AKS) Cluster
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "hasib-aks-cluster"
  location            = azurerm_resource_group.hasib_platform.location
  resource_group_name = azurerm_resource_group.hasib_platform.name
  dns_prefix          = "hasib-platform-k8s"

  default_node_pool {
    name       = "default"
    node_count = 1                # We start with 1 to save your credits
    vm_size    = "Standard_D2as_v5" # Changed from Standard_DS2_v2
  }

  # Use Managed Identity for security (No passwords needed!)
  identity {
    type = "SystemAssigned"
  }

  # Enable RBAC (Role Based Access Control)
  role_based_access_control_enabled = true

  tags = {
    environment = "Learning"
    project     = "HasibPlatform"
  }
}

# 4. Outputs (To get the Cluster name easily later)
output "resource_group_name" {
  value = azurerm_resource_group.hasib_platform.name
}

output "kubernetes_cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}