# 🚀 Hasib Platform: Cloud Infrastructure & Deployment

This repository contains the full GitOps pipeline for the Hasib Platform, running on **Azure Kubernetes Service (AKS)** and managed by **Argo CD**.

---

## 🏗 1. Infrastructure Setup (Azure)

Run these commands to recreate your cluster from scratch. (Terraform code is also included)

```bash
# Create the Resource Group
az group create --name hasib-platform-rg --location westus2

# Create the AKS Cluster (Single Node for practice)
az aks create \
    --resource-group hasib-platform-rg \
    --name hasib-aks-cluster \
    --node-count 1 \
    --generate-ssh-keys

# Connect your local kubectl to Azure
az aks get-credentials --resource-group hasib-platform-rg --name hasib-aks-cluster --overwrite-existing
```

---

## 🎡 2. Install Argo CD

Argo CD acts as the "Controller" that keeps your cluster in sync with this GitHub repo.

```bash
# Create namespace and install
kubectl create namespace argocd
kubectl apply -n argocd -f [https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml)

# Expose the Argo CD UI via a LoadBalancer
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

### 🔑 Get Argo CD Credentials
1. **URL:** Run `kubectl get svc argocd-server -n argocd` and find the `EXTERNAL-IP`.
2. **Username:** `admin`
3. **Password:** Run the following to decode the initial secret:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
```

---

## 🔗 3. Connect the Application

1. Log into the Argo CD UI.
2. Click **+ New App** and enter:
   * **Application Name:** `hasib-platform`
   * **Project:** `default`
   * **Sync Policy:** `Automatic` (Check 'Prune' and 'Self-Heal')
   * **Repository URL:** `[YOUR_GITHUB_REPO_URL]`
   * **Path:** `k8s`
   * **Cluster URL:** `https://kubernetes.default.svc`
   * **Namespace:** `default`
3. Click **Create** and watch the pods go green!

---

## 🛠 4. Common Troubleshooting Commands

| Goal | Command |
| :--- | :--- |
| **Check Pods** | `kubectl get pods` |
| **View Logs** | `kubectl logs -f deployment/frontend` |
| **Force Restart** | `kubectl rollout restart deployment frontend` |
| **Describe Pod** | `kubectl describe pod <pod_name>` |

---

## 🛑 5. Cleanup (Stop Billing)

When you are done for the day, delete the resource group to stop all charges.

```bash
az group delete --name hasib-platform-rg --yes --no-wait
```
