table 50122 "Item Cluster Assignment"
{
    Caption = 'Item Cluster Assignment';
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Cluster Code"; Code[20])
        {
            Caption = 'Cluster Code';
            DataClassification = CustomerContent;
            TableRelation = "Item Cluster";
        }

        field(2; "Scope Type"; Enum "Item Cluster Scope Type")
        {
            Caption = 'Scope Type';
            DataClassification = CustomerContent;
        }

        field(3; "Scope Code"; Code[20])
        {
            Caption = 'Scope Code';
            DataClassification = CustomerContent;
        }

        field(4; Description; Text[100])
        {
            Caption = 'Description';
            DataClassification = CustomerContent;
        }
    }

    keys
    {
        key(PK; "Cluster Code", "Scope Type", "Scope Code")
        {
            Clustered = true;
        }
    }
}
