import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, TrendingUp, Settings, CheckCircle, AlertCircle } from "lucide-react";
import Navigation from "@/components/navigation";

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-16 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Page Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-tim-green to-green-600 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                Payments
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Manage payment methods and transaction settings</p>
            </div>
            <div className="text-right">
              <div className="text-lg md:text-xl font-bold text-tim-green">$0</div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Configure how you accept payments from customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stripe */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Stripe</h3>
                    <p className="text-sm text-gray-600">Accept credit cards and online payments</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Not Connected</Badge>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>

              {/* PayPal */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">PayPal</h3>
                    <p className="text-sm text-gray-600">Accept PayPal payments</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Not Connected</Badge>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>

              {/* Cash */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cash Payment</h3>
                    <p className="text-sm text-gray-600">Accept cash payments in-person</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment options and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-deposit">Require Deposit</Label>
                  <p className="text-sm text-gray-600">Require customers to pay a deposit when booking</p>
                </div>
                <Switch id="require-deposit" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-charge">Auto-charge Full Amount</Label>
                  <p className="text-sm text-gray-600">Automatically charge the full amount after service completion</p>
                </div>
                <Switch id="auto-charge" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="payment-reminders">Payment Reminders</Label>
                  <p className="text-sm text-gray-600">Send payment reminders to customers</p>
                </div>
                <Switch id="payment-reminders" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                View your latest payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600">
                  Connect a payment method to start accepting payments from customers
                </p>
                <Button className="mt-4 bg-tim-green hover:bg-green-600">
                  Connect Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}