table 50123 "Cluster Item By Agent Buffer"
{
    Caption = 'Cluster Item By Agent Buffer';
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Agent Code"; Code[20])
        {
            Caption = 'Agent Code';
            DataClassification = CustomerContent;
        }

        field(2; "Item No."; Code[20])
        {
            Caption = 'Item No.';
            DataClassification = CustomerContent;
        }

        field(3; Description; Text[100])
        {
            Caption = 'Description';
            DataClassification = CustomerContent;
        }

        field(4; "Unit Price"; Decimal)
        {
            Caption = 'Unit Price';
            DataClassification = CustomerContent;
        }

        field(5; "Unit of Measure"; Code[10])
        {
            Caption = 'Unit of Measure';
            DataClassification = CustomerContent;
        }

        field(6; "Cluster Code"; Code[20])
        {
            Caption = 'Cluster Code';
            DataClassification = CustomerContent;
        }
    }

    keys
    {
        key(PK; "Agent Code", "Item No.")
        {
            Clustered = true;
        }
    }
}
