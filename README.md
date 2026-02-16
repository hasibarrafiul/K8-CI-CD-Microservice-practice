🚀 Hasib Platform: Cloud Recovery Guide
This guide explains how to recreate the entire Kubernetes environment on Azure AKS and redeploy the application using Argo CD.

📋 Prerequisites
Azure CLI installed and logged in (az login).

kubectl installed.

GitHub Repository containing your k8s/ folder and deploy.yml.

Docker Hub account with your images already pushed.

🛠 Step 1: Create the Azure Infrastructure
First, recreate the Resource Group and the AKS Cluster.

Bash
# 1. Create Resource Group
az group create --name hasib-platform-rg --location westus2

# 2. Create AKS Cluster (1 Node is enough for practice)
az aks create \
    --resource-group hasib-platform-rg \
    --name hasib-aks-cluster \
    --node-count 1 \
    --generate-ssh-keys

# 3. Connect your local terminal to the new cluster
az aks get-credentials --resource-group hasib-platform-rg --name hasib-aks-cluster --overwrite-existing
🎡 Step 2: Install Argo CD
Now that the cluster is alive, we need to install the "Brain" that manages the deployments.

Bash
# 1. Create the namespace for Argo CD
kubectl create namespace argocd

# 2. Install Argo CD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. Access the Argo CD UI (Change Service type to LoadBalancer)
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
To Log In:

Get the External IP: kubectl get svc argocd-server -n argocd

Get the default password:

Bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
Login at the IP with username: admin and the password above.

🔗 Step 3: Connect your GitHub Repo to Argo CD
In the Argo CD UI, click + New App.

Application Name: hasib-platform

Project: default

Sync Policy: Automatic (Check 'Prune Resources' and 'Self Heal').

Source:

Repository URL: Your GitHub Repo URL.

Path: k8s (This points to the folder where your .yaml files live).

Destination:

Cluster URL: https://kubernetes.default.svc

Namespace: default

Click Create.

🧪 Step 4: Verify Deployment
Once Argo CD finishes syncing, verify your pods are running:

Bash
kubectl get pods
kubectl get svc
Copy the EXTERNAL-IP of the frontend-service and paste it into your browser.

📝 Important Maintenance Notes
Updating Code: Just git push to your main branch. GitHub Actions will build the new image, update the YAML, and Argo CD will automatically pull the change.

CORS/DNS: If your Azure Load Balancer IP changes after recreation, you must update your GitHub Secrets and re-run the CI/CD to update the API URLs in the frontend.

Shutting Down: To save money, run az group delete --name hasib-platform-rg --yes --no-wait.
