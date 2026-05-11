page 50124 "API Salesperson Item Cluster Tools"
{
    PageType = API;
    Caption = 'apiSalespersonItemClusterTools';
    APIPublisher = 'bs';
    APIGroup = 'tirocinio';
    APIVersion = 'v1.0';
    EntityName = 'salespersonItemClusterTool';
    EntitySetName = 'salespersonItemClusterTools';

    SourceTable = "Salesperson/Purchaser";
    DelayedInsert = true;
    InsertAllowed = false;
    ModifyAllowed = false;
    DeleteAllowed = false;
    ODataKeyFields = SystemId;

    layout
    {
        area(Content)
        {
            repeater(Group)
            {
                field(id; Rec.SystemId)
                {
                    Caption = 'Id';
                }

                field(code; Rec.Code)
                {
                    Caption = 'Code';
                }

                field(name; Rec.Name)
                {
                    Caption = 'Name';
                }
            }
        }
    }

    [ServiceEnabled]
    procedure AssignAllItemsToSalesperson(SalespersonCode: Text; ClusterCode: Text): Text
    var
        Salesperson: Record "Salesperson/Purchaser";
        ItemCluster: Record "Item Cluster";
        Item: Record Item;
        SalespersonItemCluster: Record "Salesperson Item Cluster";
        SafeSalespersonCode: Code[20];
        SafeClusterCode: Code[20];
        CreatedCount: Integer;
        SkippedCount: Integer;
    begin
        SafeSalespersonCode := CopyStr(SalespersonCode, 1, MaxStrLen(SafeSalespersonCode));
        SafeClusterCode := CopyStr(ClusterCode, 1, MaxStrLen(SafeClusterCode));

        if SafeSalespersonCode = '' then
            Error('SalespersonCode is required.');

        if SafeClusterCode = '' then
            Error('ClusterCode is required.');

        if not Salesperson.Get(SafeSalespersonCode) then
            Error('Salesperson %1 does not exist.', SafeSalespersonCode);

        if not ItemCluster.Get(SafeClusterCode) then
            Error('Item cluster %1 does not exist.', SafeClusterCode);

        if Item.FindSet() then
            repeat
                SalespersonItemCluster.Reset();
                SalespersonItemCluster.SetRange("Salesperson Code", SafeSalespersonCode);
                SalespersonItemCluster.SetRange("Item No.", Item."No.");
                SalespersonItemCluster.SetRange("Cluster Code", SafeClusterCode);

                if SalespersonItemCluster.IsEmpty() then begin
                    SalespersonItemCluster.Init();
                    SalespersonItemCluster.Validate("Salesperson Code", SafeSalespersonCode);
                    SalespersonItemCluster.Validate("Cluster Code", SafeClusterCode);
                    SalespersonItemCluster.Validate("Item No.", Item."No.");
                    SalespersonItemCluster.Insert(true);
                    CreatedCount += 1;
                end else
                    SkippedCount += 1;
            until Item.Next() = 0;

        exit(StrSubstNo('Created %1 rows. Skipped %2 existing rows.', CreatedCount, SkippedCount));
    end;
}
