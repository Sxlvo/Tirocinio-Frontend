page 50108 "Agent Login WS"
{
    PageType = Card;
    SourceTable = "Salesperson/Purchaser";
    ApplicationArea = All;
    UsageCategory = None;
    ODataKeyFields = Code;

    layout
    {
        area(content)
        {
            group(General)
            {
                field(Code; Rec.Code)
                {
                    ApplicationArea = All;
                }

                field("E-Mail"; Rec."E-Mail")
                {
                    ApplicationArea = All;
                }

                field(Name; Rec.Name)
                {
                    ApplicationArea = All;
                }

                field("Item Cluster Code"; Rec."Item Cluster Code")
                {
                    ApplicationArea = All;
                }

                field("All Items"; Rec."All Items")
                {
                    ApplicationArea = All;
                }
            }
        }
    }

    [ServiceEnabled]
    procedure VerifyCredentials(Email: Text; UserPassword: Text): Text
    var
        Salesperson: Record "Salesperson/Purchaser";
    begin
        Salesperson.SetRange("E-Mail", Email);
        Salesperson.SetRange("Password", UserPassword);

        if Salesperson.FindFirst() then
            exit('Success:' + Salesperson.Name)
        else
            Error('Invalid credentials');
    end;
}
